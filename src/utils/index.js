const baseURL = process.env.REACT_APP_API_URL;

export const GetAPI = async (url, id) => {
	return fetch(baseURL + url, id)
		.then(function (response) {
			return response.json()
		})
		.catch(function (err) {
			return err
		});
};

export const GetNewAPI = async (url) => {
	return fetch(url)
		.then(function (response) {
			return response.json()
		})
		.catch(function (err) {
			return err
		});
};

// export const GetApiDistrict = async () => {
// 	return fetch('https://parseapi.back4app.com/classes/Bairro?limit=482&order=distrito,nome,cidade',
//     {
//       headers: {
//         'X-Parse-Application-Id': 'PyPlb22E1rCXA5hm8cUECKD52OmPyBluzpx7Lz4F', // This is the fake app's application id
//         'X-Parse-Master-Key': '4P103phG0KaXcCs5RWuZHLqVpdQGfXxHXgrKLQg4', // This is the fake app's readonly master key
//       }
//     })
// 	.then(function (response) {
// 		return response.json()
// 	})
// 	.catch(function (err) {
// 		return err
// 	});
// };