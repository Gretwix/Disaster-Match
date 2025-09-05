import * as React from 'react'
import { Outlet, createRootRoute } from '@tanstack/react-router'
import Navigation from '../components/ui/Navigation'

export const Route = createRootRoute({
  component: RootComponent,
})

function RootComponent() {
  return (
    <React.Fragment>
      <Navigation />
      <div className='m-4'>
        <Outlet />
      </div>
      
    </React.Fragment>
  )
}
