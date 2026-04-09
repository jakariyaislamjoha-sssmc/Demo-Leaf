import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, UserPlus, MapPin, Briefcase, User } from 'lucide-react';

export function LeadForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    age: '',
    gender: '',
    occupation: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('leads').insert([
        {
          ...formData,
          age: formData.age ? parseInt(formData.age) : null,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success('Information submitted successfully!');
    } catch (error: any) {
      console.error('Error submitting lead:', error);
      toast.error(error.message || 'Failed to submit information');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center p-12 text-center space-y-4"
      >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-3xl font-bold text-gray-900">Thank You!</h2>
        <p className="text-gray-500 max-w-md">
          Your information has been securely collected. Our team will review it and get back to you shortly.
        </p>
        <Button variant="outline" onClick={() => setSubmitted(false)} className="mt-6">
          Submit Another
        </Button>
      </motion.div>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto border-none shadow-2xl bg-white/80 backdrop-blur-sm">
      <CardHeader className="space-y-1 pb-8">
        <div className="flex items-center space-x-2 mb-2">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <UserPlus size={20} />
          </div>
          <span className="text-sm font-bold tracking-wider text-indigo-600 uppercase">Join Our Network</span>
        </div>
        <CardTitle className="text-4xl font-black tracking-tight text-gray-900">Tell us about yourself</CardTitle>
        <CardDescription className="text-lg text-gray-500">
          Complete this brief form to help us understand your profile.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-semibold text-gray-700">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  id="full_name"
                  placeholder="John Doe"
                  className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="age" className="text-sm font-semibold text-gray-700">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                className="h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">Gender</Label>
              <Select onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                <SelectTrigger className="h-12 bg-gray-50/50 border-gray-200">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-sm font-semibold text-gray-700">Location</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                <Input
                  id="location"
                  placeholder="City, Country"
                  className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="occupation" className="text-sm font-semibold text-gray-700">What do you do?</Label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-3 text-gray-400" size={18} />
              <Input
                id="occupation"
                placeholder="Software Engineer, Designer, etc."
                className="pl-10 h-12 bg-gray-50/50 border-gray-200 focus:bg-white transition-all"
                value={formData.occupation}
                onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 text-lg font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-lg shadow-indigo-200"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Information'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
