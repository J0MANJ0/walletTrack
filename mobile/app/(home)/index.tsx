import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo';
import { Link, useRouter } from 'expo-router';
import {
  Text,
  View,
  Alert,
  Image,
  RefreshControl,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SignOutButton } from '../../components/SignOutButton';
import { styles } from '../../assets/styles/home.styles';
import { useState, useEffect } from 'react';
import { userTransactions } from '@/hooks/use-transaction';

export default function Page() {
  const { user } = useUser();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);
  const { transactions, summary, loadData, loading, deleteTransction } =
    userTransactions('1');

  useEffect(() => {
    loadData();
  }, [loadData]);

  return (
    <View>
      <SignedIn>
        <Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
        <SignOutButton />
      </SignedIn>
      <SignedOut>
        <Link href='/(auth)/sign-in'>
          <Text>Sign in</Text>
        </Link>
        <Link href='/(auth)/sign-up'>
          <Text>Sign up</Text>
        </Link>
      </SignedOut>
    </View>
  );
}
