import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { HiOutlineHeart, HiArrowRight, HiOutlineTrash } from 'react-icons/hi'
import Card from '../../../components/common/Card'
import Button from '../../../components/common/Button'
import EmptyState from '../../../components/common/EmptyState'
import { setSearchParams } from '../../../redux/features/search/searchSlice'
import { useToast } from '../../../hooks/useToast'

const INITIAL_FAVORITES = [
  { id: 'r1', origin: 'Nairobi', destination: 'Mombasa', trips: 4 },
  { id: 'r2', origin: 'Nairobi', destination: 'Kisumu', trips: 1 },
]

export default function FavoriteRoutesPage() {
  const [favorites, setFavorites] = useState(INITIAL_FAVORITES)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const toast = useToast()

  const searchAgain = (route) => {
    dispatch(setSearchParams({ origin: route.origin, destination: route.destination }))
    navigate('/search')
  }

  const remove = (routeId) => {
    setFavorites((prev) => prev.filter((r) => r.id !== routeId))
    toast.info('Removed from favorite routes.')
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-fleet-black">Favorite routes</h1>
      <p className="mt-1 text-sm text-fleet-gray">Jump straight back into searching routes you travel often.</p>

      <div className="mt-6 flex flex-col gap-3">
        {favorites.length === 0 && (
          <EmptyState
            icon={<HiOutlineHeart />}
            title="No favorite routes yet"
            description="Star a route while searching to save it here."
            actionLabel="Search buses"
            onAction={() => navigate('/search')}
          />
        )}
        {favorites.map((route) => (
          <Card key={route.id} className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fleet-yellow/15 text-fleet-yellow-dark">
                <HiOutlineHeart className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="font-medium text-fleet-black">
                  {route.origin} → {route.destination}
                </p>
                <p className="text-xs text-fleet-gray">Booked {route.trips} time{route.trips === 1 ? '' : 's'}</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" rightIcon={<HiArrowRight className="h-3.5 w-3.5" />} onClick={() => searchAgain(route)}>
                Search again
              </Button>
              <button
                onClick={() => remove(route.id)}
                aria-label="Remove favorite"
                className="rounded-lg p-2 text-fleet-gray hover:bg-state-error/10 hover:text-state-error"
              >
                <HiOutlineTrash className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
