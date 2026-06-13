import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

export default function SortableItem({ id, children }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto'
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-3 border border-[#27272a] bg-[#18181b]/30 p-4 rounded mb-2 transition-colors duration-150 ${isDragging ? 'border-[#6366f1] bg-[#18181b]/90' : 'hover:border-[#3f3f46]'}`}
    >
      {/* Drag handle button */}
      <button
        type="button"
        className="cursor-grab text-[#52525b] hover:text-white transition-colors shrink-0 p-1 rounded hover:bg-[#27272a]"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>

      {/* Main content child */}
      <div className="grow min-w-0">
        {children}
      </div>
    </div>
  );
}
