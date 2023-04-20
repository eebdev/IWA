import {PrismaClient} from "@prisma/client";
import {WeatherData} from "@ctypes/types";
import {calculateMissingValue} from "@helpers/missingData";

const prisma = new PrismaClient();

export async function saveStationData(data: WeatherData) {
    const datetime = new Date(`${data.DATE} ${data.TIME}`);

    await prisma.station_data.create({
        data: {
            station_name: data.STN,
            datetime: datetime,
            temp: data.TEMP,
            dewp: data.DEWP,
            stp: data.STP,
            slp: data.SLP,
            visib: data.VISIB,
            wdsp: data.WDSP,
            prcp: data.PRCP,
            sndp: data.SNDP,
            frshtt: data.FRSHTT,
            cldc: data.CLDC,
            wnddir: data.WNDDIR,
        },
    });
}

async function getSurroundingData(
    station_name: number,
    datetime: string
): Promise<WeatherData[]> {
    const data = await prisma.station_data.findMany({
        where: {
            station_name: station_name,
            datetime: {
                lt: datetime,
            },
        },
        orderBy: {
            datetime: "desc",
        },
        take: 5,
    });

    const data2 = await prisma.station_data.findMany({
        where: {
            station_name: station_name,
            datetime: {
                gt: datetime,
            },
        },
        orderBy: {
            datetime: "asc",
        },
        take: 5,
    });

    return [...data, ...data2];
}

export async function storeMissingStationData(
    data: WeatherData,
    column_name: string
) {
    const datetime = new Date(`${data.DATE} ${data.TIME}`);

    await prisma.missing_data.create({
        data: {
            station_name: data.STN,
            datetime: datetime,
            temp: data.TEMP,
            dewp: data.DEWP,
            stp: data.STP,
            slp: data.SLP,
            visib: data.VISIB,
            wdsp: data.WDSP,
            prcp: data.PRCP,
            sndp: data.SNDP,
            frshtt: data.FRSHTT,
            cldc: data.CLDC,
            wnddir: data.WNDDIR,
            column_name: column_name,
        },
    });
}

export async function updateMissingStationData(station_name: number) {
    const missingDataList = await prisma.missing_data.findMany({
        where: {
            station_name: station_name,
        },
    });

    for (const missingData of missingDataList) {
        const surroundingData = await getSurroundingData(
            missingData.station_name,
            missingData.datetime.toISOString()
        );

        if (surroundingData.length >= 10) {
            const calculatedValue = calculateMissingValue(
                surroundingData,
                missingData.column_name
            );

            if (calculatedValue !== null) {

                missingData[missingData.column_name.toLowerCase()] = calculatedValue;
                // console.log(missingData)
                await prisma.station_data.create({
                    data: {
                        station_name: missingData.station_name,
                        datetime: missingData.datetime,
                        temp: missingData.temp,
                        dewp: missingData.dewp,
                        stp: missingData.stp,
                        slp: missingData.slp,
                        visib: missingData.visib,
                        wdsp: missingData.wdsp,
                        prcp: missingData.prcp,
                        sndp: missingData.sndp,
                        frshtt: missingData.frshtt,
                        cldc: missingData.cldc,
                        wnddir: missingData.wnddir,
                    }
                });


                await prisma.missing_data.delete({
                    where: {
                        missing_data_id: missingData.missing_data_id,
                    },
                });
            }
        }
    }
}

export async function getStationData(station_name: number) {
    return prisma.station_data.findFirst({
        where: {
            station_name: station_name,
        },
        orderBy: {
            datetime: "desc",
        },
    });
}

export async function getStationDataByDateRange(
    station_name: number,
    start_date: Date,
    end_date: Date
) {
    return prisma.station_data.findMany({
        where: {
            station_name: station_name,
            datetime: {
                gte: start_date,
                lte: end_date,
            },
        },
    });
}

export async function getWeatherStations() {
    return prisma.station_data.findMany({
        select: {
            station_name: true,
        },
        orderBy: {
            station_name: "asc",
        },
        distinct: ["station_name"],
    });
}

export async function storeLastResponse(data: WeatherData) {
    const station_name = data.STN;
    const datetime = new Date(`${data.DATE} ${data.TIME}`)

    const lastResponse = await getLastResponse(station_name);

    if (lastResponse !== null) {
        await prisma.station_status.update({
            where: {
                station_name: station_name,
            },
            data: {
                last_response: datetime,
            },
        });
        return;
    }

    await prisma.station_status.create({
        data: {
            station_name: station_name,
            last_response: datetime,
        },
    });
}

export async function getLastResponse(station_name: number) {
    return prisma.station_status.findFirst({
        where: {
            station_name: station_name,
        },
        select: {
            last_response: true,
        },
    });
}


export async function getAllLastResponse() {
    return prisma.station_status.findMany({
        orderBy: {
            last_response: "desc",
        },
    });
}

export async function getCoordinates(station_name: number) {
    return prisma.station.findFirst({
        where: {
            name: station_name,
        },
        select: {
            latitude: true,
            longitude: true,
            name: true,
        },
    });
}
