import React, { useEffect } from 'react';
import { useNotification } from './notificationContext';

const Notification = () => {
    const { notification, dispatch } = useNotification();
    useEffect(() => {
        if (notification) {

            const timer = setTimeout(() => {
                dispatch({ type: 'CLEAR_NOTIFICATION' });
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    if (!notification) return null;

    return (
        <div className="notification">
            <p>{notification}</p>
        </div>
    );
};

export default Notification;
