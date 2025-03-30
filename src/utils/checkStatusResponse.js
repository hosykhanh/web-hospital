const checkStatusResponse = (response) => {
  return response?.statusCode === 200 ? true : false;
};

export const checkStatusResponseArray = (response) => {
  return response?.every((item) => item?.status === 'OK');
};

export const checkStatusCode = (response) => response?.statusCode === 200;

export default checkStatusResponse;
