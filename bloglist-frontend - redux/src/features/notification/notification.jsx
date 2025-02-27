import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearNotification } from './notificationReducer';

const Notification = () => {
    const notification = useSelector((state) => state.notification);
    const dispatch = useDispatch();

    useEffect(() => {
        if (notification) {

            const timer = setTimeout(() => {
                dispatch(clearNotification());
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [notification, dispatch]);

    if (!notification) return null;

    return (
        <div className="notification">
            <p>{notification.payload}</p>
        </div>
    );
};

export default Notification;
