import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IProfile } from './profile.types';
import { UpdateProfileDto } from './profile.dto';

export const profileKeys = {
  me: ['profile'] as const,
  details: (id: string) => ['profile', id] as const,
};

const profileApi = {
  getMyProfile: async (): Promise<IProfile | null> => {
    const response = await fetch('/api/profile/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      if (response.status === 401) {
        return null;
      }
      throw new Error('Failed to fetch profile data');
    }

    return response.json();
  },

  updateProfile: async (data: UpdateProfileDto): Promise<IProfile | null> => {
    const response = await fetch(`/api/profile/${data.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },
};

export function useProfile() {
  return useQuery({
    queryKey: profileKeys.me,
    queryFn: profileApi.getMyProfile,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: profileKeys.me });
    },
  });
}
