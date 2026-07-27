import { useState } from "react";
import { useNavigate } from "react-router";
import { Bell, X, ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetDescription,
} from "@/app/components/ui/sheet";
import { useNotifications, Notification } from "@/app/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function NotificationPanel() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications, markAsRead, clearNotification, unreadCount, requestPushPermission } = useNotifications();

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    setOpen(false);
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button className="relative p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-white text-[#c51d1f] text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
              {unreadCount}
            </span>
          )}
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md bg-white border-l border-gray-200 p-0">
        <SheetHeader className="border-b border-gray-200 px-4 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-base font-bold text-gray-900 uppercase tracking-wide">
              Notificações
            </SheetTitle>
            <button
              onClick={() => requestPushPermission()}
              className="text-xs text-[#c51d1f] hover:underline font-bold border border-[#c51d1f]/30 px-2 py-1 rounded-md bg-red-50/50"
            >
              Ativar Web Push
            </button>
          </div>
          <SheetDescription className="sr-only">
            Visualize suas notificações
          </SheetDescription>
        </SheetHeader>

        <div className="overflow-y-auto max-h-[calc(100vh-80px)]">
          {notifications.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                Nenhuma notificação
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`px-4 py-3.5 cursor-pointer hover:bg-red-50/40 transition-colors ${
                    !notification.read ? "bg-red-50/20" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm text-gray-900 font-medium leading-snug">
                          {notification.message}
                        </p>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notification.id);
                          }}
                          className="p-1 hover:bg-gray-200 rounded transition-colors flex-shrink-0 -mr-1 -mt-0.5"
                          title="Remover"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      </div>
                      <div className="flex items-center justify-between mt-1.5">
                        <p className="text-xs text-gray-400 font-mono">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: ptBR,
                          })}
                        </p>
                        <span className="text-[11px] font-semibold text-[#c51d1f] flex items-center gap-0.5">
                          Ver tela <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
