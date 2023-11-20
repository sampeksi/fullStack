describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Cypress Tester',
      username: 'cyppi',
      password: 'CypressTester'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user)

    const user2 = {
      name: 'Cypress Tester2',
      username: 'cyppi2',
      password: 'CypressTester2'
    }
    cy.request('POST', 'http://localhost:3003/api/users', user2)

    cy.visit('http://localhost:5173')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.contains('Log in to application')
      cy.get('#username').type('cyppi')
      cy.get('#password').type('CypressTester')
      cy.get('#login-button').click()
      cy.contains('cyppi logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('Log in to application')
      cy.get('#username').type('Cypress Tester')
      cy.get('#password').type('Cypresstester')
      cy.get('#login-button').click()
      cy.contains('Log in to application')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.get('#username').type('cyppi')
      cy.get('#password').type('CypressTester')
      cy.get('#login-button').click()
    })

    it('A blog can be created', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Cypress test for adding blogs')
      cy.get('#blog-author').type('Test wisard')
      cy.get('#blog-url').type('http://blogs.com')
      cy.get('#create-blog-post').click()
      cy.contains('Cypress test for adding blogs')
    })

    it('Created blog can be liked', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Cypress test for adding blogs')
      cy.get('#blog-author').type('Test wisard')
      cy.get('#blog-url').type('http://blogs.com')
      cy.get('#create-blog-post').click()
      cy.contains('view').click()
      cy.contains('like').click()
      cy.contains('likes: 1')
    })

    it('Blog creator can delete the blog', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Cypress test for adding blogs')
      cy.get('#blog-author').type('Test wisard')
      cy.get('#blog-url').type('http://blogs.com')
      cy.get('#create-blog-post').click()
      cy.contains('view').click()
      cy.contains('delete').click()
      cy.contains('Cypress test for adding blogs').should('not.exist')
    })

    it('Only creator can delete blog', function() {
      cy.contains('new blog').click()
      cy.get('#blog-title').type('Cypress test for adding blogs')
      cy.get('#blog-author').type('Test wisard')
      cy.get('#blog-url').type('http://blogs.com')
      cy.get('#create-blog-post').click()
      cy.get('#logoutButton').click()

      cy.get('#username').type('cyppi2')
      cy.get('#password').type('CypressTester2')
      cy.get('#login-button').click()
      cy.contains('view').click()
      cy.contains('delete').should('not.exist')
    })

    it.only('Blogs are sorted by likes in descending order', function() {
      cy.request('POST', 'http://localhost:3003/api/login', {
        username: 'cyppi', password: 'CypressTester'
      }).then((response) => {
        const token = response.body.token

        const blogPosts = [
          { title: 'First Post', author: 'First Author', url: 'http://firstpost.com', likes: 5 },
          { title: 'Second Post', author: 'Second Author', url: 'http://secondpost.com', likes: 10 },
          { title: 'Third Post', author: 'Third Author', url: 'http://thirdpost.com', likes: 2 }
        ]

        cy.wrap(blogPosts).each(blogPost => {
          cy.request({
            method: 'POST',
            url: 'http://localhost:3003/api/blogs',
            headers: { 'Authorization': `Bearer ${token}` },
            body: blogPost
          })
        })

        cy.visit('http://localhost:5173');
  
        cy.get('.blog-post').each(blogPost => {
          cy.wrap(blogPost).find('button').contains('view').click()
          cy.wrap(blogPost).find('.blog-likes').should('be.visible')
        })

        cy.get('.blog-likes').then(likesElements => {
          const likesCounts = [...likesElements].map(el => parseInt(el.innerText.split(': ')[1]))

          for (let i = 0; i < likesCounts.length - 1; i++) {
            expect(likesCounts[i]).to.be.at.least(likesCounts[i + 1])
          }
        })

        cy.get('.blog-post').last().within(() => {
          cy.get('button').contains('like').as('likeButton');
          cy.get('.blog-likes').invoke('text').then((textBefore) => {
            const likesBefore = parseInt(textBefore.split(': ')[1])
            cy.get('@likeButton').click().wait(500)
            cy.get('@likeButton').click().wait(500)
            cy.get('@likeButton').click().wait(500)
            cy.get('@likeButton').click().wait(500)
            cy.get('.blog-likes').should('contain', `likes: ${likesBefore + 3}`)
          })
        })
        
        cy.wait(1000)
        cy.get('.blog-post').each(blogPost => {
          cy.wrap(blogPost).find('.blog-likes').should('be.visible')
        })
        
        cy.get('.blog-likes').then(likesElements => {
          const updatedLikesCounts = [...likesElements].map(el => parseInt(el.innerText.split(': ')[1]))
        
          for (let i = 0; i < updatedLikesCounts.length - 1; i++) {
            expect(updatedLikesCounts[i]).to.be.at.least(updatedLikesCounts[i + 1])
          }
        })
      })
    })
  }) 
})