import dayjs from 'dayjs';

const convertISODateToLocalDate = (isoDate) => {
    const date = dayjs(isoDate).toDate();
    const formattedDate = dayjs(date).format('DD/MM/YYYY');
    return formattedDate;
};

export default convertISODateToLocalDate;
