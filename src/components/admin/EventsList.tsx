/**
 * EventsList.tsx
 * 
 * Component to display and manage Islamic events in a table format
 */

import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { IslamicEvent } from './IslamicEventsManager';

interface EventsListProps {
  events: IslamicEvent[];
  onEdit: (event: IslamicEvent) => void;
  onDelete: (eventId: string) => void;
  onPublishToggle: (event: IslamicEvent) => void;
}

export const EventsList: React.FC<EventsListProps> = ({
  events,
  onEdit,
  onDelete,
  onPublishToggle
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<IslamicEvent | null>(null);
  
  const handleDeleteClick = (event: IslamicEvent) => {
    setEventToDelete(event);
    setDeleteDialogOpen(true);
  };
  
  const confirmDelete = () => {
    if (eventToDelete) {
      onDelete(eventToDelete.id);
    }
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
  const cancelDelete = () => {
    setDeleteDialogOpen(false);
    setEventToDelete(null);
  };
  
  const getEventTypeBadge = (type: string) => {
    switch (type) {
      case 'islamic':
        return <Badge variant="default" className="bg-green-600">الأعياد الإسلامية</Badge>;
      case 'ottoman':
        return <Badge variant="default" className="bg-amber-600">أحداث عثمانية</Badge>;
      case 'historical':
        return <Badge variant="default" className="bg-blue-600">أحداث تاريخية</Badge>;
      case 'custom':
        return <Badge variant="default" className="bg-purple-600">أحداث مخصصة</Badge>;
      default:
        return <Badge variant="outline">غير معروف</Badge>;
    }
  };
  
  // Format date to localized string
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch (error) {
      return dateString;
    }
  };
  
  return (
    <>
      <div className="rounded-md border">
        <Table dir="rtl">
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">عنوان الحدث</TableHead>
              <TableHead className="text-right">النوع</TableHead>
              <TableHead className="text-right">التاريخ الهجري</TableHead>
              <TableHead className="text-right">التاريخ الميلادي</TableHead>
              <TableHead className="text-right">حالة النشر</TableHead>
              <TableHead className="text-right">إجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {events.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  لا توجد أحداث للعرض
                </TableCell>
              </TableRow>
            ) : (
              events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium text-right">
                    <div>{event.titleArabic}</div>
                    <div className="text-muted-foreground text-sm">{event.titleEnglish}</div>
                  </TableCell>
                  <TableCell className="text-right">{getEventTypeBadge(event.type)}</TableCell>
                  <TableCell className="text-right">{event.dateHijri}</TableCell>
                  <TableCell className="text-right">{formatDate(event.dateGregorian)}</TableCell>
                  <TableCell className="text-right">
                    {event.isPublished ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
                        منشور
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 border-gray-200">
                        غير منشور
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2 space-x-reverse">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(event)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPublishToggle(event)}
                      >
                        {event.isPublished ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive"
                        onClick={() => handleDeleteClick(event)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent dir="rtl">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من رغبتك في الحذف؟</AlertDialogTitle>
            <AlertDialogDescription>
              سيتم حذف الحدث "{eventToDelete?.titleArabic}" نهائيًا من النظام.
              لا يمكن التراجع عن هذا الإجراء.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row-reverse space-x-2 space-x-reverse">
            <AlertDialogCancel onClick={cancelDelete}>إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
