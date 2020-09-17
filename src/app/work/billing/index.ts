import './indications-excel/indications-excel'

import type { Route } from '@vaadin/router'

export const BILLING_ROUTES: Route[] = [
    {path: '/billing',
        children: [
            {path: 'manufacturing-process/indications-excel', component: 'billing-indications-excel'},
        ]
    },
]
