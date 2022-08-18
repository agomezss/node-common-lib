import { ZonedDateTime } from 'js-joda';

export class DateUtils {

    /**
     * Check if date is before now not cosiderating the time.
     * The zone id of zonedDateTime is the reference.
     */
    public static isDateBeforeNow(zonedDateTime: string): boolean {
		let eventDate = ZonedDateTime.parse(zonedDateTime);

		// such as America/Sao Paulo
		let zoneId  = eventDate.zone();

		let now = ZonedDateTime.now(zoneId);

		let eventLocalDate = eventDate.toLocalDate();
		let nowLocalDate = now.toLocalDate();

        return eventLocalDate.isBefore(nowLocalDate);
    }

}