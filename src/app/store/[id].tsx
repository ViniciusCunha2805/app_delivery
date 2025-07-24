import { FontAwesome } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';
import { Header } from '../../components/header';

export interface RestaurantsProps {
  id: string;
  name: string;
  image: string;
  category: string;
  rating: number;
  price_level: string;
  payment_methods: string[];
}

const statusBarHeight = Constants.statusBarHeight;

export default function Index() {
  const { id } = useLocalSearchParams();
  const [restaurant, setRestaurant] = useState<RestaurantsProps | undefined>(undefined);
  const [load, setLoad] = useState(true);
  const [imageFile, setImageFile] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("http://192.168.0.3:3000/restaurants/" + id);
      const data = await res.json();
      setImageFile(data.image);

      await new Promise(resolve => setTimeout(resolve, 1000));

      const response = await fetch("http://192.168.0.3:3000/restaurantes_completo/" + id);
      const fullData = await response.json();
      setRestaurant(fullData);

      setLoad(false);
    }

    fetchData();
  }, [id]);

  if (load) {
  return (
    <View style={{ flex: 1, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={{ uri: imageFile }}
        style={{ width: '40%', height: '20%', resizeMode: 'contain', marginTop: 20 }}
      />
    </View>
  );
}

  return (
    <ScrollView className="flex-1 bg-slate-100" showsVerticalScrollIndicator={false}>
      <View className="w-full px-4" style={{ marginTop: statusBarHeight + 8 }}>
        <Header />

        <View className="mt-6 bg-white rounded-xl shadow-lg p-4">
          {/* Imagem e nome */}
          <View className="flex-row items-center space-x-4">
            <Image
              source={{ uri: imageFile || '' }}
              className="w-24 h-24 rounded-lg"
              resizeMode="cover"
            />
            <Text className="text-3xl font-semibold text-slate-800 px-4 flex-1">
              {restaurant?.name || 'Nome do restaurante'}
            </Text>
          </View>

          {/* Categoria */}
          <View className="mt-4">
            <Text className="text-lg text-gray-600">Categoria:</Text>
            <Text className="text-xl font-medium text-slate-700">
              {restaurant?.category}
            </Text>
          </View>

          {/* Avaliação */}
          <View className="mt-4 flex-row items-center">
            <FontAwesome name="star" size={20} color="#facc15" />
            <Text className="ml-2 text-lg font-medium text-slate-700">
              {restaurant?.rating.toFixed(1)} / 5.0
            </Text>
          </View>

          {/* Preço */}
          <View className="mt-4 flex-row items-center">
            <FontAwesome name="money" size={20} color="#22c55e" />
            <Text className="ml-2 text-lg font-medium text-slate-700">
              {restaurant?.price_level || '$$'}
            </Text>
          </View>

          {/* Pagamento */}
          <View className="mt-4">
            <Text className="text-lg text-gray-600">Formas de pagamento:</Text>
            <Text className="text-lg font-medium text-slate-700">
              {restaurant?.payment_methods?.join(', ')}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
