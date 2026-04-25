import React from 'react';
import { Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const NoteCard = ({ note, onDelete }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="h-full"
    >
      <Card className="relative group flex flex-col h-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] bg-card/50 backdrop-blur-sm border-primary/10">
      <CardHeader className="pb-3 border-b border-muted">
        <CardTitle className="pr-8">{note.title}</CardTitle>
        <Button
          variant="ghost" 
          size="icon" 
          onClick={() => onDelete(note.id)} 
          className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-50 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
          title="Delete Note"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="pt-4 flex-grow">
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{note.content}</p>
      </CardContent>
    </Card>
    </motion.div>
  );
};

export default NoteCard;
