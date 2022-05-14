import { NotificationProps, showNotification } from '@mantine/notifications';
import { v4 as uuid } from 'uuid';
import { AlertCircle, CircleCheck, CircleX, InfoCircle } from 'tabler-icons-react';

function notify(payload: NotificationProps): string {
   const id = uuid();
   showNotification({
      id,
      autoClose: 5000,
      ...payload
   });
   return id;
}

export function notifySuccess(message: string) {
   return notify({
      message,
      title: 'Success!',
      icon: <CircleCheck />,
      color: 'green'
   })
}

export function notifyError(message: string) {
   return notify({
      message,
      title: 'Error!',
      icon: <CircleX />,
      color: 'red'
   })
}

export function notifyInfo(message: string) {
   return notify({
      message,
      title: 'Info!',
      icon: <InfoCircle />,
      color: 'blue'
   })
}

export function notifyWarning(message: string) {
   return notify({
      message,
      title: 'Warning!',
      icon: <AlertCircle />,
      color: 'orange'
   })
}