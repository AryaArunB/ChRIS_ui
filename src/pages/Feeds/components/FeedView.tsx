import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  PageSection,
  PageSectionVariants,
  Grid,
  GridItem,
} from "@patternfly/react-core";
import classNames from 'classnames';
import {
  FeedTree,
  FeedDetails,
  NodeDetails,
  FeedOutputBrowser,
} from "../../../components";
import { setSidebarActive } from "../../../store/ui/actions";
import {
  getFeedRequest,
  destroyFeedState,
  getSelectedPlugin,
 
} from "../../../store/feed/actions";
import { PluginInstance } from "@fnndsc/chrisapi";
import { RouteComponentProps } from "react-router-dom";
import { ApplicationState } from "../../../store/root/applicationState";
import { IFeedState } from "../../../store/feed/types";
import { IUserState } from "../../../store/user/types";
import { pf4UtilityStyles } from "../../../lib/pf4-styleguides";


interface IPropsFromDispatch {
  setSidebarActive: typeof setSidebarActive;
  getFeedRequest: typeof getFeedRequest;
  destroyFeedState: typeof destroyFeedState;
  getSelectedPlugin: typeof getSelectedPlugin;
}

export type FeedViewProps = IUserState &
  IFeedState &
  IPropsFromDispatch &
  RouteComponentProps<{ id: string }>;

export const FeedView: React.FC<FeedViewProps> = ({
  setSidebarActive,
  match: {
    params: { id },
  },
  getFeedRequest,
  getSelectedPlugin,
  destroyFeedState,
  pluginInstances,
}) => {
  const getFeed = React.useCallback(() => {
    getFeedRequest(id);
  }, [id, getFeedRequest]);

  const {data}=pluginInstances;
  console.log("Data", data);

  React.useEffect(() => {
    document.title = "My Feeds - ChRIS UI site";
    setSidebarActive({
      activeGroup: "feeds_grp",
      activeItem: "my_feeds",
    });
    getFeed();
    
  }, [id, getFeed, setSidebarActive]);


  React.useEffect(()=>{
    return () => {
        if(data)
        destroyFeedState(data)
    }
  },[data, destroyFeedState])

  const onNodeClick = (node: PluginInstance) => {
    getSelectedPlugin(node);
  };

  return (
    <React.Fragment>
      <PageSection
        className="section-one"
        isWidthLimited
        variant={PageSectionVariants.darker}
      >
        <FeedDetails />
      </PageSection>

      <PageSection
        className={classNames(
          pf4UtilityStyles.spacingStyles.p_0,
          "section-two"
        )}
        variant={PageSectionVariants.darker}
      >
        <Grid span={12} className="feed-view">
          <GridItem
            className="feed-block"
            sm={12}
            smRowSpan={12}
            md={12}
            mdRowSpan={12}
            lg={12}
            lgRowSpan={12}
            xl={12}
            xlRowSpan={12}
            xl2={7}
            xl2RowSpan={12}
          >
            <FeedTree onNodeClick={onNodeClick} />
          </GridItem>
          <GridItem
            sm={12}
            smRowSpan={12}
            md={12}
            mdRowSpan={12}
            lg={12}
            lgRowSpan={12}
            xl={12}
            xlRowSpan={12}
            xl2={5}
            xl2RowSpan={12}
            className="node-block"
          >
            <NodeDetails />
          </GridItem>
        </Grid>
      </PageSection>
      <PageSection className="section-three">
        <FeedOutputBrowser handlePluginSelect={onNodeClick} />
      </PageSection>
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch: Dispatch) => ({
  getFeedRequest: (id: string) => dispatch(getFeedRequest(id)),
  setSidebarActive: (active: { activeItem: string; activeGroup: string }) =>
    dispatch(setSidebarActive(active)),
  destroyFeedState: (data:PluginInstance[]) => dispatch(destroyFeedState(data)),
  getSelectedPlugin: (item: PluginInstance) =>
    dispatch(getSelectedPlugin(item)),
});

const mapStateToProps = ({ ui, feed }: ApplicationState) => ({
  pluginInstances: feed.pluginInstances,
});


export default connect(mapStateToProps, mapDispatchToProps)(FeedView);
