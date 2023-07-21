/**
 * @api {post} /login User login
 * @apiName userLogin
 * @apiGroup Login
 *
 * @apiBody {String} email email-id of the user
 * @apiBody {String} password password entered by the user
 * @apiSuccess {String} token JWT token encode with userId and role of the user.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"srfv27635retdyucj2beyruhcbdhf"
 *     }
 *
 * @apiError UserNotFound The email of the User was not found.
 *
 * @apiError WrongPassword The user entered the wrong password.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "message": "Invalid email ID"
 *     }
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Invalid password
 *     {
 *       "message": "Invalid password"
 *     }
 */

 /**
 * @api {post} /signup User signup
 * @apiName userSignup
 * @apiGroup Login
 *
 * @apiBody {String} email email-id of the user
 * @apiBody {String} password password entered by the user(no validation)
 * @apiBody {String} name name of the user
 * @apiBody {String} designation "Tecaher" or "Student"
 * @apiBody {String} adminKey Admin key set by
 * @apiSuccess {String} token JWT token encode with userId and role of the user.
 *
 *
 * @apiSuccessExample Success-Response:
 *     HTTP/1.1 200 OK
 *     {
 *       "token":"srfv27635retdyucj2beyruhcbdhf"
 *     }
 *
 * @apiError WrongAdminKey The admin key entered by the user is invalid.
 *
 * @apiErrorExample Error-Response:
 *     HTTP/1.1 401 Wrong Admin key
 *     {
 *       "message": "Wrong Admin key"
 *     }
 *
 */