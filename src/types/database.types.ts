export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type PetSpecies =
  | 'dog'
  | 'cat'
  | 'bird'
  | 'rabbit'
  | 'hamster'
  | 'guinea_pig'
  | 'ferret'
  | 'reptile'
  | 'other'

export type PetSex = 'male' | 'female' | 'unknown'

export type PetSizeCategory = 'mini' | 'small' | 'medium' | 'large' | 'giant'

export type PetCoatType =
  | 'hairless'
  | 'short'
  | 'medium'
  | 'long'
  | 'curly'
  | 'double_coat'
  | 'feathers'
  | 'scales'
  | 'other'

export type UserRole = 'tutor' | 'caregiver' | 'business_admin' | 'super_admin'

export type TaskCategory =
  | 'feeding'
  | 'medication'
  | 'grooming'
  | 'exercise'
  | 'hygiene'
  | 'enrichment'
  | 'other'

export type TaskFrequency =
  | 'once'
  | 'daily'
  | 'weekly'
  | 'biweekly'
  | 'monthly'
  | 'custom'

export type FoodSafetyLevel = 'safe' | 'caution' | 'toxic' | 'forbidden'

export type WeatherAlertSeverity = 'info' | 'caution' | 'warning' | 'danger'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          avatar_url: string | null
          role: UserRole
          city: string | null
          state: string | null
          latitude: number | null
          longitude: number | null
          terms_accepted_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          avatar_url?: string | null
          role?: UserRole
          city?: string | null
          state?: string | null
          latitude?: number | null
          longitude?: number | null
          terms_accepted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pets: {
        Row: {
          id: string
          owner_id: string
          name: string
          species: PetSpecies
          species_custom: string | null
          breed: string | null
          is_mixed_breed: boolean
          birth_date: string | null
          approximate_age_months: number | null
          sex: PetSex | null
          is_neutered: boolean
          weight_kg: number | null
          size_category: PetSizeCategory | null
          coat_type: PetCoatType | null
          coat_color: string | null
          current_diet: string | null
          dietary_restrictions: string | null
          allergies: string | null
          health_conditions: string | null
          prescribed_medications: string | null
          reference_vet_name: string | null
          reference_vet_phone: string | null
          reference_vet_clinic: string | null
          microchip_number: string | null
          photo_url: string | null
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          name: string
          species: PetSpecies
          species_custom?: string | null
          breed?: string | null
          is_mixed_breed?: boolean
          birth_date?: string | null
          approximate_age_months?: number | null
          sex?: PetSex | null
          is_neutered?: boolean
          weight_kg?: number | null
          size_category?: PetSizeCategory | null
          coat_type?: PetCoatType | null
          coat_color?: string | null
          current_diet?: string | null
          dietary_restrictions?: string | null
          allergies?: string | null
          health_conditions?: string | null
          prescribed_medications?: string | null
          reference_vet_name?: string | null
          reference_vet_phone?: string | null
          reference_vet_clinic?: string | null
          microchip_number?: string | null
          photo_url?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          name?: string
          species?: PetSpecies
          species_custom?: string | null
          breed?: string | null
          is_mixed_breed?: boolean
          birth_date?: string | null
          approximate_age_months?: number | null
          sex?: PetSex | null
          is_neutered?: boolean
          weight_kg?: number | null
          size_category?: PetSizeCategory | null
          coat_type?: PetCoatType | null
          coat_color?: string | null
          current_diet?: string | null
          dietary_restrictions?: string | null
          allergies?: string | null
          health_conditions?: string | null
          prescribed_medications?: string | null
          reference_vet_name?: string | null
          reference_vet_phone?: string | null
          reference_vet_clinic?: string | null
          microchip_number?: string | null
          photo_url?: string | null
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pet_health_records: {
        Row: {
          id: string
          pet_id: string
          user_id: string
          record_type: 'consultation' | 'exam' | 'surgery' | 'weight_check' | 'incident' | 'other'
          title: string
          description: string | null
          event_date: string
          clinic_name: string | null
          veterinarian_name: string | null
          diagnosis: string | null
          treatment_plan: string | null
          attachment_urls: string[] | null
          cost: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          user_id: string
          record_type: 'consultation' | 'exam' | 'surgery' | 'weight_check' | 'incident' | 'other'
          title: string
          description?: string | null
          event_date?: string
          clinic_name?: string | null
          veterinarian_name?: string | null
          diagnosis?: string | null
          treatment_plan?: string | null
          attachment_urls?: string[] | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          user_id?: string
          record_type?: 'consultation' | 'exam' | 'surgery' | 'weight_check' | 'incident' | 'other'
          title?: string
          description?: string | null
          event_date?: string
          clinic_name?: string | null
          veterinarian_name?: string | null
          diagnosis?: string | null
          treatment_plan?: string | null
          attachment_urls?: string[] | null
          cost?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      vaccinations: {
        Row: {
          id: string
          pet_id: string
          user_id: string
          vaccine_name: string
          administered_date: string
          next_due_date: string | null
          batch_number: string | null
          manufacturer: string | null
          veterinarian_name: string | null
          clinic_name: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          user_id: string
          vaccine_name: string
          administered_date: string
          next_due_date?: string | null
          batch_number?: string | null
          manufacturer?: string | null
          veterinarian_name?: string | null
          clinic_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          user_id?: string
          vaccine_name?: string
          administered_date?: string
          next_due_date?: string | null
          batch_number?: string | null
          manufacturer?: string | null
          veterinarian_name?: string | null
          clinic_name?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      care_tasks: {
        Row: {
          id: string
          pet_id: string
          user_id: string
          title: string
          category: TaskCategory
          description: string | null
          frequency: TaskFrequency
          due_date: string
          is_completed: boolean
          completed_at: string | null
          completed_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pet_id: string
          user_id: string
          title: string
          category: TaskCategory
          description?: string | null
          frequency?: TaskFrequency
          due_date: string
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pet_id?: string
          user_id?: string
          title?: string
          category?: TaskCategory
          description?: string | null
          frequency?: TaskFrequency
          due_date?: string
          is_completed?: boolean
          completed_at?: string | null
          completed_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      pet_food_knowledge: {
        Row: {
          id: string
          species: string
          food_name: string
          category: string
          safety_level: FoodSafetyLevel
          description: string
          portion_guidance: string | null
          preparation_tips: string | null
          risks_and_symptoms: string | null
          veterinary_source: string
          reviewed_at: string
          created_at: string
        }
        Insert: {
          id?: string
          species: string
          food_name: string
          category?: string
          safety_level: FoodSafetyLevel
          description: string
          portion_guidance?: string | null
          preparation_tips?: string | null
          risks_and_symptoms?: string | null
          veterinary_source: string
          reviewed_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          species?: string
          food_name?: string
          category?: string
          safety_level?: FoodSafetyLevel
          description?: string
          portion_guidance?: string | null
          preparation_tips?: string | null
          risks_and_symptoms?: string | null
          veterinary_source?: string
          reviewed_at?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Profile = Database['public']['Tables']['profiles']['Row']
export type Pet = Database['public']['Tables']['pets']['Row']
export type PetHealthRecord = Database['public']['Tables']['pet_health_records']['Row']
export type Vaccination = Database['public']['Tables']['vaccinations']['Row']
export type CareTask = Database['public']['Tables']['care_tasks']['Row']
export type FoodKnowledge = Database['public']['Tables']['pet_food_knowledge']['Row']
