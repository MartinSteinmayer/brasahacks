import React from 'react';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink } from 'components/ui/navigation-menu'
import { navigationMenuTriggerStyle } from './ui/navigation-menu';

interface IHeaderMenu {
    dashboard?: boolean;
    chat?: boolean;
}

export const HeaderMenu = ({dashboard, chat}: IHeaderMenu) => {
    return (
        <NavigationMenu
            orientation='horizontal'
        >
            <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/"
                active={chat}
            >
                Fale com o Stênio
            </NavigationMenuLink>
        
            <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                href="/dashboard"
                active={dashboard}
            >
                Dashboard
            </NavigationMenuLink>            
        </NavigationMenu>
    );
}