import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {Colors} from '@constant/colors';
import AnimatedBackground from '@components/AnimationComponent/AnimationBackground';
import StackHeader from '@components/CustomHeaders/StackHeader';
import {navigateBack} from '@navigation/utils';
import CustomDropDown from '@components/DropDown/CustomDropDown';
import TextInputWithLabels from '@components/CustomInputs/TextInputWithLabels';
import {fonts} from '@constant/fontfamily';
import {fontSize, hp, wp} from '@constant/fontSize';
import CustomButton from '@components/CustomButtons/CustomButton';
import {EditIcon} from '@assets/svg/CommonIcons';
import {CrossIcon} from '@assets/svg/AuthFlowIcons';
import {
  useAddPlanMutation,
  useDeletePlanMutation,
  useGetCreatorPlansQuery,
  useUpdatePlanMutation,
} from '@rtkServices/SubcriptionService';
import {RootState, useAppSelector} from '@store/index';
import {currencies, subscriptionTypes} from '@utils/data';
import {useToastMessage} from '@hooks/useToastMessage';
import {getCurrencySymbol, textConverter} from '@utils/general';

interface FormData {
  subscriptionType: any;
  currency: any;
  price: string;
  features: string;
}

export default function SubscriptionSettings() {
  const {showError, showSuccess} = useToastMessage();
  const [existingPlans, setExistingPlans] = useState<SubscriptionPlan[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const userData = useAppSelector((state: RootState) => state.user);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);

  const {
    data: subscriptionPlans,
    isLoading,
    error,
  } = useGetCreatorPlansQuery(userData?.user?._id);

  useEffect(() => {
    if (subscriptionPlans) {
      setExistingPlans(subscriptionPlans?.data);
    }
  }, [subscriptionPlans]);

  const [addPlan, {isLoading: isAddingPlan}] = useAddPlanMutation();
  const [updatePlan, {isLoading: isUpdatingPlan}] = useUpdatePlanMutation();
  const [deletePlan, {isLoading: isDeletingPlan}] = useDeletePlanMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors, isValid, isDirty},
    watch,
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      subscriptionType: null,
      currency: null,
      price: '',
      features: '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: FormData) => {
    const newPlan: SubscriptionPlan = {
      _id: editingPlan?._id || Date.now().toString(),
      interval: data.subscriptionType?.name || data.subscriptionType,
      price: Number(data.price),
      currency: data.currency?.value || data.currency,
      description: data.features,
      creatorId: userData?.user?._id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      __v: 0,
    };

    if (editingPlan) {
      updatePlan({
        payload: {
          interval: data.subscriptionType?.value || data.subscriptionType,
          currency: data.currency?.value || data.currency,
          price: Number(data.price),
          description: data.features,
        },
        planId: editingPlan._id,
      })
        .unwrap()
        .then(res => {
          showSuccess(res?.message || '');
          setEditingPlan(null);
          setShowAddForm(false);
          reset();
        })
        .catch(err => {
          showError(err?.data?.message || 'Something went wrong');
        });
      // setEditingPlan(null);
    } else {
      // Add new plan

      addPlan({
        interval: data.subscriptionType?.value || data.subscriptionType,
        currency: data.currency?.value || data.currency,
        price: Number(data.price),
        description: data.features,
      })
        .unwrap()
        .then(res => {
          reset();
          setShowAddForm(false);
          showSuccess(res?.message || '');
        })
        .catch(err => {
          showError(err?.data?.message || 'Something went wrong');
        });
    }
  };

  const handleEdit = (plan: SubscriptionPlan) => {
    setEditingPlan(plan);
    setShowAddForm(true);

    // Find the subscription type object

    setValue(
      'subscriptionType',
      subscriptionTypes.find(type => type.value === plan.interval),
    );
    setValue(
      'currency',
      currencies.find(curr => curr.value === plan.currency),
    );
    setValue('price', plan.price.toString());
    setValue('features', plan.description);
  };

  const handleDelete = (planId: string) => {
    // setExistingPlans(prev => prev.filter(plan => plan._id !== planId));
    deletePlan({planId})
      .unwrap()
      .then(res => {
        showSuccess(res?.message || '');
      })
      .catch(err => {
        showError(err?.data?.message || 'Something went wrong');
      });
  };

  const handleCancel = () => {
    reset();
    setShowAddForm(false);
    setEditingPlan(null);
  };

  // Watch for form changes to enable/disable save button
  const watchedFields = watch();

  return (
    <View style={styles.container}>
      <AnimatedBackground
        animationSource={require('@assets/animations/AuthAnimation4.json')}
        backgroundColor="#1a1538"
        zIndex={0}
      />
      <View style={styles.contentOverlay}>
        <StackHeader
          title="Subscription Settings"
          onBackPress={() => navigateBack()}
        />

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}>
          {showAddForm && (
            <View style={styles.formContainer}>
              <Text style={styles.formTitle}>
                {editingPlan ? 'Edit Plan' : 'Add New Plan'}
              </Text>

              {/* Subscription Type Section */}
              <View style={styles.sectionContainer}>
                <Controller
                  control={control}
                  name="subscriptionType"
                  rules={{
                    required: 'Please select a billing interval',
                  }}
                  render={({field: {onChange, value}}) => (
                    <CustomDropDown
                      data={subscriptionTypes}
                      placeHolder="Select subscription type"
                      onSelect={onChange}
                      label="Billing Interval"
                      containerStyle={styles.inputContainer}
                      defaultValue={value}
                      error={errors.subscriptionType?.message as string}
                    />
                  )}
                />
              </View>

              {/* Pricing Section */}
              <View style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, {marginBottom: 0}]}>
                  Plan Cost
                </Text>

                <View style={styles.rowContainer}>
                  <View style={styles.currencyContainer}>
                    <Controller
                      control={control}
                      name="currency"
                      rules={{
                        required: 'Please select a currency',
                      }}
                      render={({field: {onChange, value}}) => (
                        <CustomDropDown
                          data={currencies}
                          placeHolder="Currency"
                          onSelect={onChange}
                          containerStyle={styles.currencyDropdown}
                          defaultValue={value}
                          error={errors.currency?.message as string}
                        />
                      )}
                    />
                  </View>

                  <View style={styles.priceContainer}>
                    <Controller
                      control={control}
                      name="price"
                      rules={{
                        required: 'Price is required',
                        pattern: {
                          value: /^\d+(\.\d{1,2})?$/,
                          message: 'Please enter a valid price (e.g., 10.99)',
                        },
                        min: {
                          value: 0.01,
                          message: 'Price must be greater than 0',
                        },
                      }}
                      render={({field: {onChange, value}}) => (
                        <TextInputWithLabels
                          value={value}
                          onChangeText={onChange}
                          keyboardType="numeric"
                          mainContainerProps={{
                            width: wp('55'),
                            marginLeft: -wp('10'),
                            marginTop: hp('1'),
                          }}
                          error={errors.price?.message}
                        />
                      )}
                    />
                  </View>
                </View>
              </View>

              {/* Features Section */}
              <View style={styles.sectionContainer}>
                <Controller
                  control={control}
                  name="features"
                  rules={{
                    required: 'Please add at least one feature',
                    minLength: {
                      value: 10,
                      message:
                        'Features description must be at least 10 characters',
                    },
                    maxLength: {
                      value: 300,
                      message:
                        'Features description cannot exceed 300 characters',
                    },
                  }}
                  render={({field: {onChange, value}}) => (
                    <TextInputWithLabels
                      value={value}
                      label="Features"
                      placeholder="Add a list of features"
                      onChangeText={onChange}
                      error={error?.message}
                      multiline
                      btnStyle={styles.bioButton}
                      maxLength={200}
                      maxLengthTitle={200}
                      numberOfLines={5}
                      height={90}
                      mainContainerProps={styles.inputContainer}
                    />
                  )}
                />
              </View>

              {/* Action Buttons */}
              <View style={styles.formButtonContainer}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancel}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <CustomButton
                  text={editingPlan ? 'Update Plan' : 'Add Plan'}
                  onPress={handleSubmit(onSubmit)}
                  disabled={!isValid}
                  btnStyle={[styles.saveButton, {flex: 1, marginLeft: 10}]}
                  textStyle={styles.saveButtonText}
                  isLoading={isAddingPlan || isUpdatingPlan}
                />
              </View>

              {/* Form Status */}
              {Object.keys(errors).length > 0 && (
                <View style={styles.errorSummary}>
                  <Text style={styles.errorSummaryTitle}>
                    Please fix the following errors:
                  </Text>
                  {Object.entries(errors).map(([key, error]) => (
                    <Text key={key} style={styles.errorSummaryText}>
                      • {error?.message as string}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Existing Plans Cards */}
          <View style={styles.plansContainer}>
            <View style={styles.headerContainer}>
              <Text style={styles.headerTitle}>Current Plans</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  if (!showAddForm && existingPlans.length >= 4) {
                    showError('You can only add up to 4 plans');
                    return;
                  }
                  setShowAddForm(!showAddForm);
                  reset();
                }}>
                <Text style={styles.addButtonText}>
                  {showAddForm ? 'Cancel' : '+ Add Plan'}
                </Text>
              </TouchableOpacity>
            </View>

            {existingPlans.map(plan => (
              <View key={plan._id} style={styles.planCard}>
                <View style={styles.planCardHeader}>
                  <View style={styles.planCardContent}>
                    <Text style={styles.planCardTitle}>
                      {textConverter(plan.interval)}
                    </Text>
                    <Text style={styles.planCardPrice}>
                      {getCurrencySymbol(plan.currency)}
                      {plan.price}/ month
                    </Text>
                  </View>
                  <View style={styles.planCardActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => handleEdit(plan)}>
                      <EditIcon
                        width={20}
                        height={20}
                        color="rgba(255,255,255,0.7)"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.deleteButton]}
                      onPress={() => handleDelete(plan._id)}>
                      <CrossIcon width={20} height={20} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.planCardFeatures} numberOfLines={5}>
                  {plan.description}
                </Text>
              </View>
            ))}
          </View>

          {/* Add/Edit Form */}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentOverlay: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  formContainer: {
    paddingTop: 20,
    paddingBottom: 40,
  },
  sectionContainer: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: Colors.white,
    marginBottom: 15,
    opacity: 0.8,
  },
  inputContainer: {
    marginBottom: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyContainer: {
    flex: 1,
  },
  priceContainer: {
    flex: 1,
  },
  currencyDropdown: {
    marginBottom: 0,
    width: wp('30'),
  },
  descriptionInput: {
    marginBottom: 0,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 40,
    paddingHorizontal: 10,
  },
  plansContainer: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  headerTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
  },
  addButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  addButtonText: {
    color: Colors.white,
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Medium'],
  },
  planCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  planCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  planCardContent: {
    flex: 1,
  },
  planCardTitle: {
    fontSize: fontSize.f18,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  planCardPrice: {
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    color: 'rgba(255, 255, 255, 0.8)',
  },
  planCardActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  deleteButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  deleteButtonText: {
    color: '#FF6B6B',
    width: 20,
    height: 20,
    textAlign: 'center',
    lineHeight: 18,
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-Medium'],
  },
  planCardFeatures: {
    fontSize: fontSize.f12,
    fontFamily: fonts['Poppins-Regular'],
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 18,
  },
  formTitle: {
    fontSize: fontSize.f16,
    fontFamily: fonts['Poppins-SemiBold'],
    color: Colors.white,
    marginBottom: 20,
    textAlign: 'center',
  },
  formButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    paddingHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: 'transparent',
    width: wp('30'),
    height: hp('6'),
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('5'),
  },
  cancelButtonText: {
    color: Colors.white,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
    opacity: 0.8,
  },
  saveButton: {
    backgroundColor: Colors.white,
    marginTop: hp('5'),
  },
  saveButtonDisabled: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  saveButtonText: {
    color: Colors.black,
    fontSize: fontSize.f14,
    fontFamily: fonts['Poppins-Medium'],
  },
  errorSummary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: 'rgba(255, 0, 0, 0.1)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 0, 0, 0.3)',
  },
  errorSummaryTitle: {
    color: '#FF6B6B',
    fontFamily: fonts['Poppins-SemiBold'],
    fontSize: fontSize.f12,
    marginBottom: 5,
  },
  errorSummaryText: {
    color: '#FF6B6B',
    fontFamily: fonts['Poppins-Regular'],
    fontSize: fontSize.f10,
    marginBottom: 2,
  },
  bioButton: {
    height: 100,
  },
});
