import { 
    Note, 
    Group, 
    Entry 
} from '../types/Notes';
/**
 * @license     MIT License
 * @author      Maxylan
 * @copyright © 2023 Max Olsson
 */


export const generateUUID = () => Date.now().toString(16) + Math.random().toString(16).substring(2, 10);

export const date = (date: Date|undefined = undefined) => {
    let d = date || new Date();
    return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
};
export const dayName = (date: string | number | Date, locale: Intl.LocalesArgument) => {
    let d = new Date(date);
    return d.toLocaleDateString(locale, { weekday: 'long' });        
}
export const argToDate = (arg: string | number | Date): string => {
    let d = new Date(arg);
    return date(d);
}
export const dateKey = (arg: string | number | Date | undefined = undefined) => {
    let d = arg ? new Date(arg) : new Date();
    return d.getFullYear() + '_' + (d.getMonth() + 1);
};
export const getMonthName = (month: number) => {
    switch (month) {
        case 1: return 'January';
        case 2: return 'February';
        case 3: return 'March';
        case 4: return 'April';
        case 5: return 'May';
        case 6: return 'June';
        case 7: return 'July';
        case 8: return 'August';
        case 9: return 'September';
        case 10: return 'October';
        case 11: return 'November';
        case 12: return 'December';
    }
};

export const isGroup = (e: Entry|Group): boolean => e && e.hasOwnProperty('entries');
export const hasGroups = (a: (Entry|Group)[]): boolean => a.some((e: Entry|Group) => isGroup(e));
export const hasChecked = (a: (Entry|Group)[]): boolean => a.some((e: Entry|Group) => {
    if (isGroup(e)) {
        return (e as Group).entries.some((ge: Entry) => ge.hasOwnProperty('checked') && ge.checked)
    }
    else {
        return e.hasOwnProperty('checked') && (e as Entry).checked;
    }
});

export const round = (num: number, decimals: number = 2): number => {
    return Math.round((num + Number.EPSILON) * (10 ** decimals)) / (10 ** decimals);
}

export const reduceEntries = (entries: (Group|Entry)[]): number => {
    return round(entries.reduce((acc, entry) => {
        if (entry.hasOwnProperty('entries')) {
            return acc + reduceEntries((entry as Group).entries);
        }
        let p = (entry as Entry).price ?? 0;
        if ((entry as Entry).amount) {
            p *= (entry as Entry).amount!;
        }
        return acc + p;
    }, 0));
}

export const reduceGroupEntries = (entries: (Group|Entry)[]): number => {
    return reduceEntries(entries.filter((e: Entry|Group) => isGroup(e)));
}

export const reduceCheckedEntries = (entries: (Group|Entry)[]): number => {
    return reduceEntries(entries.filter((e: Entry|Group) => {
        return isGroup(e) ? (e as Group).entries.some((e: Entry) => e.checked) : (e as Entry).checked;
    }).map((e: Entry|Group) => {
        if (isGroup(e)) {
            let group = {...e as Group};
            group.entries = group.entries.filter((e: Entry) => e.checked);
            return group;
        }
        return e;
    }));
}

export const toBase64 = (note: Note|string): string => {
    if (typeof note !== 'string') {
        note = JSON.stringify(note, null, 0);
    }

    return btoa(note);
}
export const fromBase64 = (bejo: string): any => {
    if (typeof bejo !== 'string') {
        throw new Error('fromBase64: argument must be a string');
    }

    return JSON.parse(atob(bejo));
}
export const noteFromBEJO = (bejo: string): Note|false => {
    if (typeof bejo !== 'string') {
        throw new Error('fromBase64: argument must be a string');
    }

    let note: Note|false = false;
    try {
        note = JSON.parse(atob(bejo));
    }
    catch (e) {
        return false;        
    }
    if (!note) {
        return false;
    }

    return (
        (note as Note) &&
        (note as Note).id &&
        (note as Note).title &&
        (note as Note).entries &&
        (note as Note).created &&
        (note as Note).updated ?  
        note : false
    );
}
