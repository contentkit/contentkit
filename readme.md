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
const token = '39f6dd0053d6fb3ea86f283ef'

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

![https://raw.githubusercontent.com/unshift/contentkit/master/meta/contentkit-editor-demo.png](https://raw.githubusercontent.com/unshift/contentkit/master/meta/contentkit-login.png)