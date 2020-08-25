import gql from "graphql-tag";

export const GET_USER_DATA = gql`
    mutation MyMutation($first_name: String, $last_name: String, $id: Int) {
        insert_mini_app_users(
            on_conflict: { constraint: users_pkey, update_columns: last_name }
            objects: { last_name: $last_name, first_name: $first_name, id: $id }
        ) {
            returning {
                position {
                    level
                    title
                }
                first_name
                id
                last_name
            }
        }
    }
`;
