/**
 * PersonalInfoForm.tsx
 * 
 * Form for editing personal information, including nickname support
 */

import React, { useState } from 'react';
import { UserData } from '@/services/AppwriteAuthBridge';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Pencil, Check, User } from 'lucide-react';

interface PersonalInfoFormProps {
  user: UserData;
  onSubmit: (data: Partial<UserData>) => Promise<void>;
  isLoading: boolean;
}

export const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  user,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    nickname: user.nickname || '',
    useNickname: user.metadata?.useNickname || false,
    email: user.email || '',
    institute: user.metadata?.institute || '',
    specialty: user.metadata?.specialty || '',
    bio: user.metadata?.bio || '',
    location: user.metadata?.location || '',
    isProfilePublic: user.metadata?.isPublic !== false,
    interests: user.metadata?.interests?.join(', ') || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for submission
    const updatedData: Partial<UserData> = {
      name: formData.name,
      nickname: formData.nickname,
      metadata: {
        ...user.metadata,
        useNickname: formData.useNickname,
        institute: formData.institute,
        specialty: formData.specialty,
        bio: formData.bio,
        location: formData.location,
        isPublic: formData.isProfilePublic,
        interests: formData.interests ? formData.interests.split(',').map(i => i.trim()) : []
      }
    };
    
    await onSubmit(updatedData);
  };
  
  const getAvatarInitials = () => {
    const displayName = formData.useNickname ? formData.nickname : formData.name;
    
    if (!displayName) return 'مس'; // Guest/Anonymous
    
    // Get first 2 characters (works for both Arabic and Latin scripts)
    return displayName.substring(0, 2);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 flex flex-col items-center">
          <div className="mb-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user.avatarUrl || ''} alt={formData.name} />
              <AvatarFallback>{getAvatarInitials()}</AvatarFallback>
            </Avatar>
          </div>
          
          <Card className="w-full">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="useNickname" className="text-right block">استخدام الاسم المستعار</Label>
                  <Switch
                    id="useNickname"
                    checked={formData.useNickname}
                    onCheckedChange={(checked) => handleSwitchChange('useNickname', checked)}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="isProfilePublic" className="text-right block">ملف شخصي عام</Label>
                  <Switch
                    id="isProfilePublic"
                    checked={formData.isProfilePublic}
                    onCheckedChange={(checked) => handleSwitchChange('isProfilePublic', checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-2/3 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-right block">الاسم الكامل</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="الاسم الكامل"
                className="text-right"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="nickname" className="text-right block">
                الاسم المستعار
                {formData.useNickname && <span className="text-green-600 mr-2">● مفعّل</span>}
              </Label>
              <Input
                id="nickname"
                name="nickname"
                value={formData.nickname}
                onChange={handleChange}
                placeholder="اللقب أو الاسم المستعار للظهور للآخرين"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-right block">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@sabeel.app"
                className="text-right"
                disabled  // Email changes should be handled separately with verification
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location" className="text-right block">الموقع</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="المدينة، الدولة"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="institute" className="text-right block">المؤسسة / الجامعة</Label>
              <Input
                id="institute"
                name="institute"
                value={formData.institute}
                onChange={handleChange}
                placeholder="اسم المؤسسة أو الجامعة"
                className="text-right"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="specialty" className="text-right block">التخصص</Label>
              <Input
                id="specialty"
                name="specialty"
                value={formData.specialty}
                onChange={handleChange}
                placeholder="المجال أو التخصص"
                className="text-right"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="interests" className="text-right block">الاهتمامات</Label>
            <Input
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="الفقه، التفسير، الحديث، التاريخ الإسلامي (مفصولة بفواصل)"
              className="text-right"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio" className="text-right block">نبذة شخصية</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="اكتب نبذة قصيرة عن نفسك..."
              className="h-24 text-right"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              جاري الحفظ...
            </>
          ) : (
            <>
              <Check className="mr-2 h-4 w-4" />
              حفظ التغييرات
            </>
          )}
        </Button>
      </div>
    </form>
  );
};
