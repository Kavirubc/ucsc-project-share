'use client'

import { Loader2 } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface LoadingModalProps {
    isOpen: boolean
    title?: string
    description?: string
}

export function LoadingModal({ 
    isOpen, 
    title = 'Loading', 
    description = 'Please wait...' 
}: LoadingModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={() => {}}>
            <DialogContent className="sm:max-w-[425px] flex flex-col items-center justify-center py-10 gap-4" showCloseButton={false} onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <DialogHeader className="items-center space-y-2">
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                    <DialogDescription className="text-center">
                        {description}
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
