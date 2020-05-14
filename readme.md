## API

`POST /api/v1/employes`

Example of expected body: 
```
{
	"name": "Veronika Kulik",
	"position": "qa",
	"salary": 3000,
	"yearOfBirth": 1992
}
```

Example of expected successful response:

`201 Created`

```
{
	"id": "5ed739c9-c159-4af8-9c0c-1c39aa717151"
}
```

Example of error:

`422 Unprocessable entity`

```
{
	"message": "name is required"
}
```

## Architecture

* As a storage for the data, a json file is used
* As a http framework, express is used
