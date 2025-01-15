/users
    POST
    description: Create a new user
    parameters:
        - name: username
          type: string
          required: true
        - name: password
          type: string
           required: true
    responses:
        201: User created successfully
        400: Missing values
        409: User already exists
      
  GET
    description: Get all users (admin-only)
    parameters:
        - name: page
        type: integer
        required: false
        - name: limit
        type: integer
        required: false
    responses:
        200: List of users
    /{id}
        GET
            description: Get user by ID
            responses:
                200: User details
                404: User not found
        DELETE
            description: Delete user by ID
            responses:
                204: User deleted successfully
                403: Unauthorized
    /login
        POST
            description: Authenticate user and return a token
            parameters:
                - name: username
                type: string
                required: true
                - name: password
                type: string
                required: true
          responses:
              200: Login successful
              401: Invalid credentials

/questions
    GET
        description: Get all questions
        parameters:
            - name: page
            type: integer
            required: false
            - name: limit
            type: integer
            required: false
    /{id}
        GET
            description: Get question by ID
    /answer/{question_id}
        POST
            description: Submit an answer to a question
            parameters:
                - name: user_id
                type: string
                required: true
                - name: answer
                type: string
                required: true
            responses:
                200: Answer submitted
                400: Invalid answer format

/leaderboard
    GET
        description: Get the leaderboard
        parameters:
            - name: limit
            type: integer
            required: false
              - name: category
              type: string
              required: false
        responses:
            200: Leaderboard details
