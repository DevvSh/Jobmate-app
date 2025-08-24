const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
let supabase;

try {
  supabase = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.warn('Supabase initialization failed. Using mock data for development.');
}

// Get user profile
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    let profile;
    
    // If Supabase is initialized, fetch profile from database
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (error) throw error;
      profile = data;
    } else {
      // Use mock data for development
      profile = getMockProfile(userId);
    }
    
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const profileData = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    if (!profileData) {
      return res.status(400).json({ error: 'Profile data is required' });
    }
    
    // If Supabase is initialized, update profile in database
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('user_id', userId);
        
      if (error) throw error;
      
      // Fetch the updated profile
      const { data: updatedProfile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
        
      if (fetchError) throw fetchError;
      
      res.status(200).json(updatedProfile);
    } else {
      // For development without database
      res.status(200).json({
        ...getMockProfile(userId),
        ...profileData,
        updated_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Create user profile
router.post('/', async (req, res) => {
  try {
    const profileData = req.body;
    
    if (!profileData || !profileData.user_id) {
      return res.status(400).json({ error: 'Profile data with user_id is required' });
    }
    
    // If Supabase is initialized, create profile in database
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([profileData])
        .select();
        
      if (error) throw error;
      
      res.status(201).json(data[0]);
    } else {
      // For development without database
      res.status(201).json({
        id: Math.random().toString(36).substring(2, 15),
        ...profileData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({ error: 'Failed to create profile' });
  }
});

// Helper function for mock profile data
function getMockProfile(userId) {
  return {
    id: '1',
    user_id: userId,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    title: 'Frontend Developer',
    summary: 'Experienced frontend developer with 5+ years of experience in building responsive web and mobile applications using React and React Native.',
    skills: 'React, React Native, JavaScript, TypeScript, HTML, CSS, Redux',
    created_at: '2023-01-15T00:00:00.000Z',
    updated_at: '2023-06-20T00:00:00.000Z',
  };
}

module.exports = router;