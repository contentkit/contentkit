#!/usr/bin/bash

mkdir -p ~/.aws
touch ~/.aws/credentials

curl -d '{ "ttl": "3600s" }' \
  -H "X-Vault-Token: $VAULT_TOKEN" \
  https://vault.k8s.menubar.co/v1/aws/creds/apex-up \
  | jq -r '.data | "[default]\naws_access_key_id = \(.access_key)\naws_secret_access_key = \(.secret_key)"' > ~/.aws/credentials