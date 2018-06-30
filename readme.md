## contentkit

[ContentKit](https://contentkit.co) is a headless content management system (CMS). 

![contentkit](https://raw.githubusercontent.com/unshift/contentkit/master/meta/contentkit-editor-demo.png)

### Features

- Markdown editor ([Monograph](https://github.com/unshift/monograph) - a wrapper around [DraftJs](https://draftjs.org/)).
- Version control
- REST API
- Project and team management

Authors create content which is accessible via a REST API. 

```js
const token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1NjE4NTk4NTEsImlhdCI6MTUzMDMyMzg1MSwicHJvamVjdElkIjoiY2plM3ZqNWZkMDU2YjAxNTdibDk4MDhxNyIsInVzZXJJZCI6ImNqajBuMHBqbGFlbWIwMTExYmRobDhyb3QiLCJtb2RlbE5hbWUiOiJVc2VyIn0.wwQcILPSlNMFvlmVXuG9-pNs5QqBQKkPBBwp5KtLk60'

fetch('https://contentkit.co/api/v1/cjj0n1be8akko01031wadmjmz', {
  headers: {
    Authorization: 'Bearer ' + token,
    Accept: 'application/json'
  }
}).then(resp => resp.json())
.then(resp => {
  console.log(resp)
})
```
