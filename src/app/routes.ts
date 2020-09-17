import {ENVIRONMENT} from "../environment"

import {BILLING_ROUTES} from './work/billing'
import type { Route } from '@vaadin/router'

const INTERNAL_ROUTES: Route[] = [
    {path: '/', redirect: ENVIRONMENT.baseUrl + '/home'},
    {path: '/home', component: 'home-component'},
    {path: '/user', component: 'user-component'},
]

export const ROUTES =
    INTERNAL_ROUTES
        .concat(BILLING_ROUTES)
        .concat([
            {path: '/(.*)', component: 'main-menu'},
        ])
        .map(r => ( {...r, path: ENVIRONMENT.baseUrl + r.path } ))

// export const ROUTES = [ ...routes,  {path: '(.*)', component: 'x-not-found-view'}]

