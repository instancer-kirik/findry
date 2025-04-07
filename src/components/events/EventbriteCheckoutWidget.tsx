import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';

// Define window.EBWidgets which is loaded from Eventbrite scripts
declare global {
  interface Window {
    EBWidgets: {
      createWidget: (options: EventbriteWidgetOptions) => void;
    };
  }
}

interface EventbriteWidgetOptions {
  widgetType: 'checkout';
  eventId: string;
  modal?: boolean;
  modalTriggerElementId?: string;
  onOrderComplete?: () => void;
  iframeContainerId?: string;
  iframeContainerHeight?: number;
  iframeAutoAdapt?: number;
}

export interface EventbriteCheckoutWidgetProps {
  eventId: string;
  eventbriteId?: string;
  mode?: 'modal' | 'inline';
  height?: number;
  buttonText?: string;
  className?: string;
  buttonVariant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
  buttonSize?: 'default' | 'sm' | 'lg' | 'icon';
  onOrderComplete?: () => void;
  autoAdapt?: number;
}

const EventbriteCheckoutWidget: React.FC<EventbriteCheckoutWidgetProps> = ({
  eventId,
  eventbriteId,
  mode = 'modal',
  height = 450,
  buttonText = 'Get Tickets',
  className = '',
  buttonVariant = 'default',
  buttonSize = 'default',
  onOrderComplete,
  autoAdapt
}) => {
  const modalTriggerId = useRef(`eventbrite-modal-trigger-${eventId}`);
  const containerId = useRef(`eventbrite-container-${eventId}`);
  
  // Use eventbriteId if available, otherwise use the standard eventId
  const actualEventId = eventbriteId || eventId;
  
  useEffect(() => {
    // Load Eventbrite widget script
    const script = document.createElement('script');
    script.src = 'https://www.eventbrite.com/static/widgets/eb_widgets.js';
    script.async = true;
    
    // Initialize widget once script is loaded
    script.onload = () => {
      if (!window.EBWidgets) {
        console.error('Eventbrite Widgets failed to load');
        return;
      }
      
      // Default callback if none provided
      const defaultCallback = () => {
        console.log('Eventbrite order complete!');
      };
      
      // Create widget based on mode
      if (mode === 'modal') {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: actualEventId,
          modal: true,
          modalTriggerElementId: modalTriggerId.current,
          onOrderComplete: onOrderComplete || defaultCallback,
        });
      } else {
        window.EBWidgets.createWidget({
          widgetType: 'checkout',
          eventId: actualEventId,
          iframeContainerId: containerId.current,
          iframeContainerHeight: height,
          iframeAutoAdapt: autoAdapt,
          onOrderComplete: onOrderComplete || defaultCallback,
        });
      }
    };
    
    document.body.appendChild(script);
    
    // Clean up
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [actualEventId, mode, height, onOrderComplete, autoAdapt]);
  
  if (mode === 'modal') {
    return (
      <Button 
        id={modalTriggerId.current}
        variant={buttonVariant}
        size={buttonSize}
        className={className}
      >
        <Ticket className="mr-2 h-4 w-4" />
        {buttonText}
      </Button>
    );
  }
  
  return (
    <div id={containerId.current} className={className} style={{ minHeight: `${height}px` }}>
      <div className="flex items-center justify-center py-8">
        <div className="animate-pulse flex space-x-2 text-muted-foreground">
          <div className="h-3 w-3 rounded-full bg-current"></div>
          <div className="h-3 w-3 rounded-full bg-current"></div>
          <div className="h-3 w-3 rounded-full bg-current"></div>
        </div>
      </div>
    </div>
  );
};

export default EventbriteCheckoutWidget; 