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


