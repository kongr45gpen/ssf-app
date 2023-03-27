import Moment from "moment";
import slugify from "slugify";
import { groupBy, mapKeys, mapValues } from "lodash";

export function parseFilter(filter, partitions) {
    const urlParts = filter.split("+");

    const results = mapValues(mapKeys(partitions, (p) => p.id), (partition) => {
        for (const partitionValue of partition.attributes.possibleValues) {

            if (urlParts.includes(partitionValue)) {
                return partitionValue;
            }
        }
        // Not partitioned here; if there is a default element, use it
        if (partition.attributes.required) {
            return partition.attributes.possibleValues[0];
        } else {
            return null;
        }
    });

    return results;
}

export function classifyAndPartition(events, partition) {
    if (!events || !partition) return null;

    for (let event of events) {
        let eventPartition = {}
        if (partition.attributes.type == "day") {
            eventPartition = eventToDay(event.attributes);
        } else if (partition.attributes.type == "room") {
            eventPartition = eventToRoom(event.attributes);
        } else {
            // ???
        }

        if (!event.attributes.partitions) event.attributes.partitions = {};

        event.attributes.partitions[partition.id] = eventPartition;
    }

    const partitionEvents = groupBy(events, (e) => e.attributes.partitions[partition.id].tag);

    const possibleValues = mapValues(partitionEvents, (e) => e[0].attributes.partitions[partition.id]);
    const sortedPossibleValues = Object.keys(possibleValues).sort((a, b) => possibleValues[a].order - possibleValues[b].order);

    return {
        events: partitionEvents,
        valueDetails: mapKeys(possibleValues, (v) => v.tag),
        possibleValues: sortedPossibleValues,
    };
}

function eventToDay(event) {
    const start = Moment(event.start);
    return {
        tag: start.format('dddd').toLowerCase(),
        display: start.format('dddd d MMM'),
        order: start.day(),
    }
}

function eventToRoom(event) {
    const name = event.room.data.attributes.name;

    return {
        tag: slugify(name, { lower: true, strict: true }),
        display: name,
        order: name
    }
}