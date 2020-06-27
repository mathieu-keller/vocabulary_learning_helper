import {mocked} from "ts-jest/utils";
import {useSelector} from "react-redux";
import {getAppStore} from "../../../testUtils";
import {render} from '@testing-library/react';
import React from "react";
import {NavigationBar} from "../../../../components/navigation/navigationBar/NavigationBar";
import {Category} from "../../../../containers/category/CategoryView";
import {createLocation, createMemoryHistory, Location} from "history";
import {userActionFunctions} from "../../../../actions/user";

jest.spyOn(userActionFunctions, 'setSelectedCategory');
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: () => jest.fn()
}));
const useSelectorMock = mocked(useSelector);
describe('testing NavigationBar', () => {
  const history = createMemoryHistory();

  const mockUseSelectorWithData = (isLogin: boolean, categories: Category[] = []): void => {
    const store = getAppStore();
    useSelectorMock.mockImplementation((callback) => callback({...store, user: {...store.user, categories: categories, isLogin: isLogin}}));
  };
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });
  const getUrl = (path: string): { match: { isExact: boolean; path: string; url: string; params: any }; location: Location } => {
    const match = {
      isExact: true,
      path,
      url: path,
      params: {}
    };
    const location = createLocation(match.url);
    return {match, location};
  };
  it("show only logout menus", async () => {
    const selectedCategory: Category = {id: "1", name: "testCat", columns: [], owner: "testUser"};
    mockUseSelectorWithData(true, [selectedCategory]);
    mockUseSelectorWithData(false);
    const {getAllByTestId} = render(<NavigationBar {...getUrl('/')} history={history}/>);
    expect(getAllByTestId('navigation-tabs-logout').length).toBe(1);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledTimes(0);
  });
  it("show only login menus", async () => {
    const selectedCategory: Category = {id: "1", name: "testCat", columns: [], owner: "testUser"};
    mockUseSelectorWithData(true, [selectedCategory]);
    mockUseSelectorWithData(true);
    const {getAllByTestId} = render(<NavigationBar {...getUrl('/')} history={history}/>);
    expect(getAllByTestId('navigation-tabs-login').length).toBe(1);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledTimes(0);
  });
  it("set selected category if the url have a category", async () => {
    const selectedCategory: Category = {id: "1", name: "testCat", columns: [], owner: "testUser"};
    mockUseSelectorWithData(true, [selectedCategory]);
    render(<NavigationBar {...getUrl('/vocabulary/testUser/testCat')} history={history}/>);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledTimes(1);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledWith(selectedCategory);
  });

  it("change set selected category if the category in the url changes", async () => {
    const selectedCategory1: Category = {id: "1", name: "testCat", columns: [], owner: "testUser"};
    const selectedCategory2: Category = {id: "1", name: "otherCat", columns: [], owner: "testUser"};
    mockUseSelectorWithData(true, [selectedCategory1, selectedCategory2]);
    const {rerender} = render(<NavigationBar {...getUrl('/vocabulary/testUser/testCat')} history={history}/>);
    rerender(<NavigationBar  {...getUrl('/vocabulary/testUser/otherCat')} history={history}/>);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledTimes(2);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledWith(selectedCategory1);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledWith(selectedCategory2);
  });

  it("change set selected category if the user in the url changes", async () => {
    const selectedCategory1: Category = {id: "1", name: "testCat", columns: [], owner: "testUser"};
    const selectedCategory2: Category = {id: "1", name: "testCat", columns: [], owner: "otherUser"};
    mockUseSelectorWithData(true, [selectedCategory1, selectedCategory2]);
    const {rerender} = render(<NavigationBar {...getUrl('/vocabulary/testUser/testCat')} history={history}/>);
    rerender(<NavigationBar {...getUrl('/vocabulary/otherUser/testCat')} history={history}/>);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledTimes(2);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledWith(selectedCategory1);
    expect(userActionFunctions.setSelectedCategory).toHaveBeenCalledWith(selectedCategory2);
  });
});
