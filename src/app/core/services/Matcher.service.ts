import {UrlMatchResult, UrlSegment} from '@angular/router';

export class MatcherService {
  public static customMatcher = (url: UrlSegment[]) => {
    if (url[0].path[0] === ' ') {
      console.log("amjad");
      return {consumed: url , posParams: null};
    }
  }
}
