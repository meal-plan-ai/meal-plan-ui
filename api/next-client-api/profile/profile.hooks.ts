import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { nextClientProfileApi } from './profile.query';
import { UpdateProfileDto } from './profile.dto';

export const profileKeys = {
  me: ['profile'] as const,
  details: (id: string) => ['profile', id] as const,
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: async () => {
      try {
        const { data } = await nextClientProfileApi.getMyProfile();
        return data;
      } catch (error: any) {
        // If 401 error, the interceptor will handle redirect
        // Return null so ProtectedRoute redirects appropriately
        if (error.status === 401) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileData: UpdateProfileDto) => {
      const { data } = await nextClientProfileApi.updateProfile(profileData);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}
