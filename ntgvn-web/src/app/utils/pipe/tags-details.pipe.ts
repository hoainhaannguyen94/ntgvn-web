import { Pipe, PipeTransform, inject } from '@angular/core';
import { TagService } from '@utils/service';
import { map } from 'rxjs';

@Pipe({
    name: 'tagsDetails',
    standalone: true,
    pure: true
})
export class TagsDetailsPipe implements PipeTransform {
    tagService = inject(TagService);

    transform(tagIds: string[]) {
        const filter = tagIds.reduce((acc, cur) => {
            if (acc) {
                acc += ' or '
            }
            acc += `_id eq '${cur}'`;
            return acc;
        }, '');
        return this.tagService.getTagList$({
            $filter: filter
        }).pipe(map(res => res.value.reduce((acc, cur) => {
            acc.push(cur.name);
            return acc;
        }, []).join(', ')));
    }
}
