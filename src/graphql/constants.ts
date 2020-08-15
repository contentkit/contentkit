export enum Typename {
  MUTATION = 'Mutation',
  
  IMAGES_MUTATION_RESPONSE = 'images_mutation_response',
  POSTS_MUTATION_RESPONSE = 'posts_mutation_response',
  PROJECTS_MUTATION_RESPONSE = 'projects_mutation_response',
  ORIGINS_MUTATION_RESPONSE = 'origins_mutation_response',
  TAGS_MUTATION_RESPONSE = 'tags_mutation_response',
  POSTS_TAGS_MUTATION_RESPONSE = 'posts_tags_mutation_response',
  SETTINGS_MUTATION_RESPONSE = 'settings_mutation_response',
  POSTS_TAGS = 'posts_tags',
  TAGS = 'tags',

  TAG = 'tags',
  IMAGE = 'images',
  POST = 'posts',
  USER = 'users',
  PROJECT = 'projects',
  ORIGIN = 'origins',
  SETTING = 'settings'
}

export const GraphQLContexts = {
  HASURA: { target: 'hasura' },
  AUTH: { target: 'auth' }
}
