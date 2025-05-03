import { Campaign } from './types';

export const getCampaigns = async (): Promise<Campaign[]> => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_HOST}/campaigns/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch campaigns: ${response.statusText}`);
    }

    const data: Campaign[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching campaigns:', error);
    return [];
  }
};