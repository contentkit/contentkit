

export function getHasuraClaims (userId: string, role = 'user') {
  return {
    'https://hasura.io/jwt/claims': {
      'x-hasura-default-role': role,
      'x-hasura-allowed-roles': [role],
      'x-hasura-user-id': userId
    }
  }
}