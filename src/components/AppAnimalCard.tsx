
import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MapPin, Calendar, User } from 'lucide-react';

interface Animal {
  id: string;
  name: string;
  species: string;
  breed: string;
  age: string;
  gender: string;
  location: string;
  rescueDate: string;
  description: string;
  personality: string[];
  isUrgent: boolean;
  imageUrl?: string;
}

interface AppAnimalCardProps {
  animal: Animal;
}

const AppAnimalCard = ({ animal }: AppAnimalCardProps) => {
  return (
    <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 bg-white rounded-2xl overflow-hidden hover:scale-[1.02]">
      <div className="aspect-[4/3] overflow-hidden">
        <img 
          src={animal.imageUrl || 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=400&h=300&fit=crop'}
          alt={animal.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
      </div>
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{animal.name}</h3>
            <p className="text-gray-600 text-sm">{animal.species} • {animal.breed}</p>
          </div>
          <div className="flex items-center space-x-2">
            {animal.isUrgent && (
              <Badge className="bg-red-100 text-red-800 hover:bg-red-100 text-xs">
                긴급
              </Badge>
            )}
            <Heart className="w-5 h-5 text-gray-400 hover:text-red-500 cursor-pointer transition-colors" />
          </div>
        </div>
        
        <div className="space-y-2 mb-3">
          <div className="flex items-center space-x-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm">{animal.age} • {animal.gender}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">{animal.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">구조일: {animal.rescueDate}</span>
          </div>
        </div>
        
        <p className="text-gray-700 text-sm mb-4 line-clamp-2">
          {animal.description}
        </p>
        
        <div className="flex flex-wrap gap-1">
          {animal.personality.slice(0, 3).map((trait, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 text-xs"
            >
              {trait}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-5 pt-0">
        <button className="w-full golden hover:bg-yellow-500 text-gray-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-md">
          자세히 보기
        </button>
      </CardFooter>
    </Card>
  );
};

export default AppAnimalCard;
