import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import {
  launchCameraAsync,
  useCameraPermissions,
  MediaTypeOptions,
} from 'expo-image-picker';
import {
  getCurrentPositionAsync,
  requestForegroundPermissionsAsync,
  reverseGeocodeAsync,
  LocationObject,
} from 'expo-location';
import { decode } from 'base64-arraybuffer';
import { supabase } from '../services/supabase';

export default function ReportScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('طرق');
  const [image, setImage] = useState<string | null>(null);
  const [status, requestPermission] = useCameraPermissions();
  const [location, setLocation] = useState<LocationObject | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const pickImage = async () => {
    if (!status?.granted) {
      await requestPermission();
      return;
    }

    const result = await launchCameraAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const getLocation = async () => {
    setIsLocating(true);
    setErrorMsg(null);
    setAddress(null);

    try {
      const { status } = await requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        setIsLocating(false);
        return;
      }

      const locationData = await getCurrentPositionAsync({});
      setLocation(locationData);

      const reverseGeocode = await reverseGeocodeAsync({
        latitude: locationData.coords.latitude,
        longitude: locationData.coords.longitude,
      });

      if (reverseGeocode && reverseGeocode.length > 0) {
        const addr = reverseGeocode[0];
        const formattedAddress = [
          addr.street,
          addr.city,
          addr.region,
          addr.country,
        ]
          .filter(Boolean)
          .join(', ');
        setAddress(formattedAddress || 'Address not available');
      } else {
        setAddress('Address not available');
      }
    } catch (error) {
      setErrorMsg('Failed to get location');
    } finally {
      setIsLocating(false);
    }
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;

    // Validate required fields
    if (!title.trim() || !image) {
      Alert.alert('Please fill the title and take a photo');
      return;
    }

    setIsSubmitting(true);
    try {
      // Step 1: Upload Image
      const response = await fetch(image);
      const arrayBuffer = await response.arrayBuffer();

      const fileExt = 'jpg';
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `reports/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('reports')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('reports')
        .getPublicUrl(filePath);

      const image_url = publicUrlData.publicUrl;

      // Step 2: Insert Data
      const payload = {
        title: title.trim(),
        description: description?.trim() || null,
        category: category || null,
        latitude: location?.coords?.latitude ?? null,
        longitude: location?.coords?.longitude ?? null,
        address: address ?? null,
        image_url,
      };

      const { error: insertError } = await supabase.from('reports').insert(payload);
      if (insertError) throw insertError;

      // Step 3: Feedback + Reset
      Alert.alert('Success', 'Report sent to City Hall!');
      setTitle('');
      setDescription('');
      setImage(null);
    } catch (e: any) {
      console.log('Supabase submit error:', e);
      Alert.alert('Error', e?.message ?? 'Something went wrong while sending the report');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter report title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {['طرق', 'إنارة', 'نظافة', 'مياه', 'أخرى'].map((cat) => {
            const selected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, selected && styles.categoryChipSelected]}
                onPress={() => setCategory(cat)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.categoryChipText,
                    selected && styles.categoryChipTextSelected,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter report description"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </View>

      <TouchableOpacity style={styles.imagePlaceholder} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <>
            <Text style={styles.cameraIcon}>📷</Text>
            <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <TouchableOpacity style={styles.locationButton} onPress={getLocation}>
          <Text style={styles.locationButtonText}>📍 Get Current Location</Text>
        </TouchableOpacity>
        {isLocating && (
          <Text style={styles.locatingText}>Locating...</Text>
        )}
        {address && !isLocating && (
          <Text style={styles.addressText}>{address}</Text>
        )}
        {errorMsg && (
          <Text style={styles.errorText}>{errorMsg}</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Sending...' : 'Submit Report'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: '#F5F7FA',
    borderWidth: 1,
    borderColor: '#E1E4E8',
    marginRight: 12,
  },
  categoryChipSelected: {
    backgroundColor: '#007AFF',
    borderWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  categoryChipText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    textAlign: 'center',
  },
  categoryChipTextSelected: {
    color: '#fff',
    fontWeight: '700',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  imagePlaceholder: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  cameraIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  imagePlaceholderText: {
    fontSize: 16,
    color: '#666',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  locationButton: {
    backgroundColor: '#34C759',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  locationButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  locatingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 8,
    padding: 12,
    backgroundColor: '#fff5f5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
});
