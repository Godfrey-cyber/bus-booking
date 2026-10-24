import PagePlaceholder from '../../components/common/PagePlaceholder'

export default function TicketPage() {
  return <PagePlaceholder title="Ticket" phase="Upcoming phase" />
}

// curl -X POST http://localhost:8000/api/v1/users/new-user \
//   -H "Content-Type: application/json" \
//   -d '{
//     "role_id": 1,
//     "first_name": "Lisa",
//     "last_name": "Meagan",
//     "email": "lisa.admin@example.com",
//     "phone": "0712345678",
//     "password": "Admin123!",
//     "is_verified": true
//   }'


// curl -X POST http://localhost:8000/api/v1/users/new-user \
//   -H "Content-Type: application/json" \
//   -d '{
//     "role_id": 1,
//     "first_name": "Harriet",
//     "last_name": "Mary",
//     "email": "harriet.admin@example.com",
//     "phone": "0712345678",
//     "password": "Admin123!",
//     "is_verified": true
//   }'