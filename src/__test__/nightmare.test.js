import Nightmare from 'nightmare'

const TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1Mjg1NzM1OTAsImlhdCI6MTUyNTk4MTU5MCwicHJvamVjdElkIjoiY2plM3ZqNWZkMDU2YjAxNTdibDk4MDhxNyIsInVzZXJJZCI6ImNqaDB5MWQ3cmkxYWUwMTAxb2V4MjhqbXciLCJtb2RlbE5hbWUiOiJVc2VyIn0.4I4BpRqXfmz0sFIg9jyNbD_YcYRs_VDIAK-wOl8SRfQ'

const nightmare = Nightmare({ show: true })
describe('monograph', () => {
  test('monograph', async () => {
    await nightmare
      .goto('http://localhost:1234')
      .wait(1000)
      .type('#email', 'example@example.com')
      .type('#password', 'example')
      .click('#submit-login')
      .wait(2000)
      .goto('http://localhost:1234/posts/cjh29fa46nzhp01503rfvsp71')
      .wait(1000)
      .type('.public-DraftEditor-content', 'lorem ipsum')
      .wait(3000)
    let data = await nightmare.evaluate(() => {
      return window.localStorage.getItem('cjh29fa46nzhp01503rfvsp71')
    })
    console.log(data)
  }, 1e9)
})
