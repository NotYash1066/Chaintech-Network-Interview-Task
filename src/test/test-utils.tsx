import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import { MemoryRouter } from 'react-router-dom'
import { AppRoutes } from '../app/app-routes'
import { AppProviders } from '../app/providers'

export function renderApp(initialEntries: string[] = ['/']) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AppProviders>
        <AppRoutes />
      </AppProviders>
    </MemoryRouter>,
  )
}

export function renderWithRouter(
  ui: ReactElement,
  initialEntries: string[] = ['/'],
) {
  return render(<MemoryRouter initialEntries={initialEntries}>{ui}</MemoryRouter>)
}
