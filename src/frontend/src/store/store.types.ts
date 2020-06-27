import {Category} from "../containers/category/CategoryView";
import {Vocab} from "../containers/vocabulary/VocabularyView";
import {VocabularyList} from "../containers/vocabulary/VocabularyListView";

export type UserStore = {
  readonly isLogin: boolean;
  readonly categories: Category[];
  readonly vocabularyLists: VocabularyList[];
  readonly selectedCategory: Category;
}
export type TestVocabularyStore = {
  readonly vocabularies: Vocab[];
  readonly front: string;
  readonly back: string;
};

export type AppStore = {
  readonly user: UserStore;
  readonly testVocabularies: TestVocabularyStore;
};
