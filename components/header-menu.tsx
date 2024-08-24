'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from 'components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from './ui/navigation-menu';

interface IHeaderMenu {
    currentPage: string;
    setCurrentPage: Dispatch<SetStateAction<string>>;
}

export const HeaderMenu = ({currentPage, setCurrentPage}: IHeaderMenu) => {

    const handleClick = (e) => {
        const id = e.currentTarget.id;
        console.log("Clicked item:", id);
        setCurrentPage(e.currentTarget.id)
        console.log(currentPage)
        // Perform actions based on the ID
    };

    return (
        <NavigationMenu
            orientation='horizontal'
        >
            <NavigationMenuLink
                id='chat'
                className={navigationMenuTriggerStyle()}
                onClick={(e) => setCurrentPage(e.currentTarget.id)}
                active={currentPage === 'chat'}
            >
                Fale com o Stênio
            </NavigationMenuLink>
        
            <NavigationMenuLink
                id='dashboard'
                className={navigationMenuTriggerStyle()}
                onClick={(e) => setCurrentPage(e.currentTarget.id)}
                active={currentPage === 'dashboard'}
            >
                Dashboard
            </NavigationMenuLink>
        </NavigationMenu>
    );
}